'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const t = await queryInterface.sequelize.transaction();

    try {
      // 1️⃣ Insert school
      const [school] = await queryInterface.bulkInsert(
        'erp_trn_schools',
        [
          {
            school_name: 'Sunrise Public School',
            school_code: 'SPS001',
            city: 'Mumbai',
            state: 'Maharashtra',
            established_year: 1995,
            type: 'Public',
            image_path: null,
            is_active: 'Y',
            created_by: 1,
            updated_by: 1,
            created_at: new Date(),
            updated_at: new Date()
          }
        ],
        { returning: true, transaction: t }
      );

      // 2️⃣ Create user for the school
      const passwordHash = await bcrypt.hash('password123', 10);
      const [user] = await queryInterface.bulkInsert(
        'erp_trn_users',
        [
          {
            trn_school_id: school.trn_school_id,
            first_name: 'School',
            last_name: 'Admin',
            email: 'sps@gmail.com',
            password_hash: passwordHash,
            is_active: 'Y',
            created_at: new Date(),
            updated_at: new Date()
          }
        ],
        { returning: true, transaction: t }
      );

      // 3️⃣ Assign role (assuming School Admin role exists with id=4, change as per your roles table)
      await queryInterface.bulkInsert(
        'erp_mst_user_has_roles',
        [
          {
            trn_user_id: user.trn_user_id,
            mst_role_id: 4,
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
    await queryInterface.bulkDelete('erp_mst_user_has_roles', { trn_user_id: 1 }, {});
    await queryInterface.bulkDelete('erp_trn_users', { email: 'sps@gmail.com' }, {});
    await queryInterface.bulkDelete('erp_trn_schools', { school_code: 'SPS001' }, {});
  }
};
