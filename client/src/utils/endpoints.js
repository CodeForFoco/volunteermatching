// "metadata" for endpoints. Not sure if this
// is the best way to handle separate pages.
import axios from 'axios';
import ArrayInput from '../objects/ArrayInput/ArrayInput';
import Select from '../objects/Select/Select';
import SelectMany from '../objects/SelectMany/SelectMany';
import TextArea from '../objects/TextArea/TextArea';
import ArrayCheckBox from '../objects/ArrayCheckBox/ArrayCheckBox';
import SelectOneSearch from '../objects/SearchSelectOne/SelectOneSearch';

const frequency_modifier = [
  'day',
  'week',
  'month'
];

const frequency_unit = [
  'every',
  'every other',
  '1st',
  '2nd',
  '3rd',
  '4th'
];

//const roles = [

//];

const endpoints = {
  opportunities: {
    title: 'Opportunities',
    endpoint: '/api/opportunities',
    text(data) {
      return `${data.partner_name} | ${data.name}`;
    },
    fields: [{
      name: 'partner_name',
      component: SelectOneSearch,
      getOptions: {
        endpoint: '/api/partners',
        property: 'name'
      }
    }, [{
        name: 'location_street'
      }, {
        name: 'location_city'
    }], {
      name: 'location_zip',
      type: 'number'
    }, {
      name: 'name'
    }, {
      name: 'shift_hours',
      type: 'number'
    }, [{
        name: 'start_date',
        type: 'date'
      }, {
        name: 'end_date',
        type: 'date'
    }], {
      name: 'commitment_length_months',
      type: 'number'
    }, [{
        name: 'frequency_unit',
        component: Select,
        options: frequency_unit
      }, {
        name: 'frequency_modifier',
        component: Select,
        options: frequency_modifier
    }], {
      name: 'training_hours_required',
      type: 'number'
    }, {
      name: 'volunteers_needed',
      type: 'number'
    }, {
      name: 'tags',
      component: SelectMany,
      customGet(token) {
        return new Promise((resolve, reject) => {
          axios.get('/api/tag_categories', { headers: {
            Authorization: 'Bearer ' + token
          }}).then(res => {
            let tags = [];
            res.data.items.forEach(category => {
              category.tags.forEach(tag => {
                tags.push(tag);
              });
            });
            res.data = tags;
            resolve(res);
          }).catch(reject);
        });
      }
    }, {
      name: 'description',
      component: TextArea
    }],
  },
  partners: {
    title: 'Partners',
    endpoint: '/api/partners',
    text(data) {
      return `${data.name} | ${data.opportunity_count} Opportunities`;
    },
    fields: [{
      name: 'name'
    }]
  },
  tag_categories: {
    title: 'Tags',
    endpoint: '/api/tag_categories',
    text(data) {
      return `${data.category_name} | ${data.tags.length} Tags`;
    },
    fields: [{
      name: 'category_name'
    }, {
      name: 'tags',
      label: 'Tags',
      placeholder: 'Enter One Tag (Ex: "painting")',
      component: ArrayInput
    }]
  },
  users: {
    title: 'Users',
    endpoint: '/api/users',
    text(data) {
      return `${data.roles.indexOf('Admin') !== -1 ? 'Admin' : 'User'} | ${data.username}`;
    },
    fields: [{
      name: 'username'
    }, {
      name: 'password',
      type: 'password'
    }, {
      name: 'roles',
      component: ArrayCheckBox,
      list: ['Admin']
    }]
  },
  fieldsToState(endpoint) {
    const fields = endpoints[endpoint].fields;
    let obj = {};
    fields.forEach((item) => {
      if (Array.isArray(item)) {
        item.forEach((child) => {
          if (child.name) obj[child.name] = '';  
        });
      }
      if (item.name) obj[item.name] = '';
    })
    return obj;
  },
  squashFields(endpoint) {
    const fields = endpoints[endpoint].fields;
    let obj = {};
    fields.forEach((item) => {
      if (Array.isArray(item)) {
        item.forEach((child) => {
          obj[child.name] = child;
        });
      }
      obj[item.name] = item;
    })
    return obj;
  }
}

export default endpoints;