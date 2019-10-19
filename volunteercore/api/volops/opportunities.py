from flask import jsonify, request, url_for
from flask_login import login_required
from volunteercore import db
from volunteercore.api import bp
from volunteercore.volops.models import Partner, Opportunity
from volunteercore.api.errors import bad_request
from flask_whooshalchemyplus import index_one_record
from whoosh import scoring

# API GET endpoint returns individual opportunity from given id
@bp.route('/api/opportunities/<int:id>', methods=['GET'])
@login_required
def get_opportunity_api(id):
    return jsonify(Opportunity.query.get_or_404(id).to_dict())

# Returns opportunities via a weighted search.
# Points are scored like so: tags > name > description
# See docs for more information:
# https://whoosh.readthedocs.io/en/latest/recipes.html#score-results-based-on-the-position-of-the-matched-term
def get_opportunities_score(searcher, fieldname, text, matcher):
    print(matcher.value_as("tags"))
    print(matcher.value_as("name"))
    print(matcher.value_as("description"))
    tag_match_count = matcher.value_as("tags")
    name_match_count = matcher.value_as("name")
    description_match_count = match.value_as("description")
    return tag_match_count * 3 + name_match_count * 2 + description_match_count

# API GET endpoint returns all opportunities, paginated with given page and
# quantity per page. Accepts search argument to filter with Whoosh search.
@bp.route('/api/opportunities', methods=['GET'])
@login_required
def get_opportunities_api():
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    search = request.args.get('search')
    frequency_unit = request.args.get('frequency_unit')
    frequency_modifier = request.args.get('frequency_modifier')
    
    opportunity_weighting = scoring.FunctionWeighting(get_opportunities_score)
    with Opportunity.query.whoosh_search(opportunity_weighting) as s:
        print(s)
    
    if search:
        data = Opportunity.query.whoosh_search(search, or_=True)
    else:
        data = Opportunity.query
    data = Opportunity.to_colletion_dict(
            data, page, per_page, 'api.get_opportunities_api')
    return jsonify(data)

# API PUT endpoint to update an opportunity
@bp.route('/api/opportunities/<int:id>', methods=['PUT'])
@login_required
def update_opportunity_api(id):
    opportunity = Opportunity.query.get_or_404(id)
    data = request.get_json() or {}
    if 'partner_name' in data:
        data['partner_id'] = Partner.query.filter_by(
            name=data['partner_name']).first().id
    opportunity.from_dict(data, new_opportunity=False)
    opportunity.update_partner_string()
    opportunity.update_tag_strings()
    db.session.add(opportunity)
    db.session.commit()
    index_one_record(opportunity)
    return jsonify(opportunity.to_dict())

# API POST endpoint to create a new opportunity
@bp.route('/api/opportunities', methods=['POST'])
@login_required
def create_opportunity_api():
    data = request.get_json() or {}
    if 'name' not in data or 'partner_name' not in data:
        return bad_request('must include opportunity and partner name field')
    if Opportunity.query.filter_by(
            name=data['name'], partner_id=Partner.query.filter_by(
            name=data['partner_name']).first().id).first():
        return bad_request(
            'this opportunity already exists with this partner')
    data['partner_id'] = Partner.query.filter_by(
        name=data['partner_name']).first().id
    opportunity = Opportunity()
    opportunity.from_dict(data, new_opportunity=True)
    opportunity.partner_string = Partner.query.filter_by(
        id=opportunity.partner_id).first().name
    db.session.add(opportunity)
    db.session.commit()
    index_one_record(opportunity)
    response = jsonify(opportunity.to_dict())
    response.status_code = 201
    response.headers['Location'] = url_for(
        'api.get_opportunity_api', id=opportunity.id)
    return response

# API DELETE endpoint to delete an opportunity
@bp.route('/api/opportunities/<int:id>', methods=['DELETE'])
@login_required
def delete_opportunity_api(id):
    if not Opportunity.query.filter_by(id=id).first():
        return bad_request('this opportunity does not exist')
    opportunity = Opportunity.query.get_or_404(id)
    db.session.delete(opportunity)
    db.session.commit()
    index_one_record(opportunity, delete=True)
    return '', 204
