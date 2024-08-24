exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    title: {
      type: 'TEXT',
      notNull: true
    },
    year: {
      type: 'INTEGER',
      notNull: true
    },
    genre: {
      type: 'TEXT',
      notNull: true
    },
    performer: {
      type: 'TEXT',
      notNull: true
    },
    duration: {
      type: 'INTEGER',
      notNull: false,
    },
    // eslint-disable-next-line camelcase
    album_id: {
      type: 'VARCHAR(50)',
      references: '"albums"',
      notNull: false,
      onDelete: 'CASCADE'
    }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
