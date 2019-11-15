import Sequelize, { Model } from 'sequelize';
import { addMonths } from 'date-fns';
import Plan from './Plan';

class Registration extends Model {
    static init(sequelize) {
        super.init(
            {
                start_date: Sequelize.DATE,
                end_date: Sequelize.DATE,
                price: Sequelize.FLOAT,
            },
            {
                sequelize,
            }
        );

        this.addHook('beforeSave', async registration => {
            if (!registration.end_date) {
                const { duration } = await Plan.findByPk(registration.plan_id);

                registration.end_date = addMonths(
                    registration.start_date,
                    duration
                );
            }

            if (!registration.price) {
                const { price, duration } = await Plan.findByPk(
                    registration.plan_id
                );

                registration.price = price * duration;
            }
        });

        return this;
    }

    static associate(models) {
        this.belongsTo(models.Student, {
            foreignKey: 'student_id',
            as: 'student',
        });
        this.belongsTo(models.Plan, {
            foreignKey: 'plan_id',
            as: 'plan',
        });
    }
}

export default Registration;
