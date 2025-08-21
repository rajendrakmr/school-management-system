'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const t = await queryInterface.sequelize.transaction();

    try {
      

      // 2️⃣ Create user for the school
      const passwordHash = await bcrypt.hash('password123', 10);
      await queryInterface.bulkInsert(
        'erp_trn_users',
        [
          {
            trn_school_id: null,
            first_name: 'Root User',
            last_name: 'Walky',
            email: 'admin@admin.com',
            password_hash: passwordHash,
            is_active: 'Y',
            created_at: new Date(),
            updated_at: new Date()
          }
        ],
        { transaction: t }
      );

      // Get user row back
      const [user] = await queryInterface.sequelize.query(
        `SELECT * FROM erp_trn_users WHERE email = 'admin@admin.com' LIMIT 1`,
        { type: Sequelize.QueryTypes.SELECT, transaction: t }
      ); 
      await queryInterface.bulkInsert(
        'erp_trn_user_has_roles',
        [
          {
            trn_user_id: user.trn_user_id,
            mst_role_id: 1,
            created_at: new Date(),
            updated_at: new Date()
          }
        ],
        { transaction: t }
      );

      await t.commit();
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('erp_trn_user_has_roles', {}, {});
    await queryInterface.bulkDelete('erp_trn_users', { email: 'admin@admin.com' }, {}); 
  }
};
