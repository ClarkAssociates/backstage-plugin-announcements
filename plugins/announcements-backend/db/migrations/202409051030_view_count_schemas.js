// @ts-check

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('AnnouncementToUser', table => {
    table.comment('The table for announcement views by users.');
    table.integer('AnnouncementToUserId').notNullable().primary().comment('Announcement to user view ID.');
    table.text('AnnouncementId').notNullable().comment('Announcement viewed.');
    table.text('User').notNullable().comment('User who viewed announcement.');

    table
      .foreign('AnnouncementId', 'FK_AnnouncementToUser_announcements')
      .references('id')
      .inTable('announcements')
      .onDelete('SET NULL');
    table.timestamp('DateCreated').notNullable();
    table.unique(['AnnouncementId', 'User'], { indexName: 'UQ_AnnouncementToUser_AnnouncementId_User' });
  });

  await knex.schema.createView('vwAnnouncementViews', function (view) {
    view.columns(['AnnouncementId', 'UserCount']); // ? how to reference count
    view.as(
      knex('AnnouncementToUser')
        .select('AnnouncementId', 'UserCount')
        .from('AnnouncementToUser')
        .count('User', { as: 'UserCount' })
        .groupBy('AnnouncementId'),
    );
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropView('vwAnnouncementViews');

  await knex.schema.alterTable('AnnouncementToUser', table => {
    table.dropIndex([], 'UQ_AnnouncementToUser_AnnouncementId_User');
    table.dropForeign('AnnouncementId', 'FK_AnnouncementToUser_announcements');
  });

  await knex.schema.dropTable('AnnouncementToUser');
};
