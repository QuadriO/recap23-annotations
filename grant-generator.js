const cds = require("@sap/cds");

const DEFAULT_GRANT = ['SELECT']
const DB_USER = 'DEMOUSER'

const generateGrantSql = (grants, entity, type) => {
  return `GRANT ${grants.join(", ")} ON ${type} ${entity.replaceAll(".", "_").toUpperCase()} TO USER ${DB_USER};`
}

const run = async () => {
  const csn = await cds.load("*");
  const namespace = csn.namespace;

  // filter all entities which will be created as tables
  const dbEntities = Object.entries(csn.definitions).filter(
    ([key, value]) => value.kind === "entity" && key.startsWith(namespace)
  );

  // filter all entities which will be created as views
  const serviceEntities = Object.entries(csn.definitions).filter(
    ([key, value]) =>
      value.kind === "entity" &&
      !key.startsWith(namespace) &&
      !key.startsWith("sap.")
  );

  // filter all services
  const serviceArray = Object.entries(csn.definitions).filter(
    ([_key, value]) => value.kind === "service"
  );
  const serviceObj = Object.fromEntries(serviceArray)

  const dbGrants = dbEntities.map(([key, value]) => {
    const grants = value['@customDbGrant'] ?? DEFAULT_GRANT
    return generateGrantSql(grants, key, 'TABLE')
  })

  const serviceGrants = serviceEntities.map(([key, value]) => {
    const grants = value['@customServiceGrant'] ?? DEFAULT_GRANT
    return  generateGrantSql(grants, key, 'VIEW')
  })

  const grantList = dbGrants.concat(serviceGrants)

  console.log(JSON.stringify(grantList, null, 2));

  return grantList;
};

run();

module.exports = run;
