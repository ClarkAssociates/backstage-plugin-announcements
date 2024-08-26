// @ts-check

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  return knex.schema.table('announcements', table => {
    table.boolean('isLimitedAudience').defaultTo(false).nullable();
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  return knex.schema.table('announcements', table => {
    table.dropColumn('isLimitedAudience');
  });
};
