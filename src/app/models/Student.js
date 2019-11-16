import Sequelize, { Model } from 'sequelize';

class Student extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                age: Sequelize.INTEGER,
                weight: Sequelize.FLOAT,
                height: Sequelize.FLOAT,
            },
            {
                sequelize,
            }
        );

        return this;
    }

    static associate(models) {
        this.hasMany(models.Checkin, { as: 'checkins' });
    }
}

export default Student;
