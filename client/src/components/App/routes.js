module.exports = [{
  path: '/',
  component: require('../../pages/Home/Home.js').default
}, {
  path: '/opportunities',
  component: require('../../pages/Opportunities/Opportunities').default
}, {
  path: '/opportunities/:ID',
  component: require('../../pages/Opportunity/Opportunity.js').default
}, {
  path: '/dashboard/addopportunity',
  component: require('../../pages/PostOpportunity/PostOpportunity.js').default
}, {
  path: '/dashboard/editopportunity/:ID',
  component: require('../../pages/PutOpportunity/PutOpportunity.js').default
}, {
  path: '/dashboard/addpartner',
  component: require('../../pages/PostPartner/PostPartner.js').default
}, {
  path: '/dashboard/editpartner/:ID',
  component: require('../../pages/PutPartner/PutPartner.js').default
}, {
  path: '/dashboard/adduser',
  component: require('../../pages/PostUser/PostUser.js').default
}, {
  path: '/dashboard/edituser/:ID',
  component: require('../../pages/PutUser/PutUser.js').default
}, {
  path: '/partners',
  component: require('../../pages/Partners/Partners.js').default
}, {
  path: '/dashboard',
  component: require('../../pages/Dashboard/Dashboard.js').default
}, {
  path: '/settings',
  component: require('../../pages/Account/Account.js').default
}, {
  component: require('../../pages/Page404/Page404.js').default
}];