exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('proposal_user_subscriptions', table => {
      table.increments();
      table.integer('proposal_id').unsigned().notNullable();
      table.foreign('proposal_id').references('proposals.id');
      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('users.id');
      table.unique(['proposal_id', 'user_id']);
      table.timestamps();
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('proposal_user_subscriptions')]);
};
