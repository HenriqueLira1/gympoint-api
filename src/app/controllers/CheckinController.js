import * as Yup from 'yup';
import { subWeeks, startOfDay, endOfDay } from 'date-fns';
import { Op, fn, col } from 'sequelize';

import Student from '../models/Student';
import Checkin from '../models/Checkin';

class CheckinController {
    async index(req, res) {
        const checkins = await Student.findByPk(req.params.id, {
            attributes: ['id', 'name'],
            include: [
                {
                    model: Checkin,
                    as: 'checkins',
                    attributes: ['id', 'created_at'],
                },
            ],
        });

        return res.json(checkins);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            id: Yup.number().required(),
        });

        if (!(await schema.isValid(req.params))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { id } = req.params;

        const student = await Student.findByPk(id);

        /**
         * Check if student exists
         */
        if (!student) {
            return res.status(400).json({ error: 'Student not found' });
        }

        /**
         * Check if student can checkin
         */

        const currentDate = new Date();

        const checkin = await Checkin.findOne({
            attributes: [[fn('COUNT', col('id')), 'checkinCount']],
            where: {
                student_id: id,
                created_at: {
                    [Op.between]: [
                        subWeeks(startOfDay(currentDate), 1),
                        endOfDay(currentDate),
                    ],
                },
            },
        });

        if (checkin.get('checkinCount') > 4) {
            return res.status(400).json({
                error: 'Maximum check-ins reached for a 7 day period',
            });
        }

        const { id: checkinId } = await Checkin.create({ student_id: id });

        return res.json(checkinId);
    }
}

export default new CheckinController();
