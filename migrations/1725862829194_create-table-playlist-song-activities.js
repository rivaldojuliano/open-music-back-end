/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('playlist_song_activities', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    // eslint-disable-next-line camelcase
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    // eslint-disable-next-line camelcase
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    // eslint-disable-next-line camelcase
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    action: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    time: {
      type: 'TEXT',
      notNull: true
    }
  });

  pgm.addConstraint('playlist_song_activities', 'fk_playlist_song_activities.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('playlist_song_activities');
};
