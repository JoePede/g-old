exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('proposals', (table) => {
      table.increments();
      table.integer('author_id').unsigned().notNullable();
      table.foreign('author_id').references('users.id');
      table.string('title').notNullable();
      table.text('body').notNullable();
      table
        .enu('state', [
          'proposed',
          'voting',
          'accepted',
          'rejected',
          'revoked',
          'deleted',
          'survey',
        ])
        .notNullable()
        .defaultsTo('proposed');
      table.integer('votes').defaultsTo(0);
      table.integer('poll_one_id').unsigned().notNullable().unique();
      table.foreign('poll_one_id').references('polls.id');
      table.integer('poll_two_id').unsigned().unique();
      table.foreign('poll_two_id').references('polls.id');
      table.string('spokesman');
      table.timestamp('deleted_at');
      table.timestamps();
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([knex.schema.dropTable('proposals')]);
};
