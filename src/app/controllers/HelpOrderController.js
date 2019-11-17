import * as Yup from 'yup';

import Student from '../models/Student';
import HelpOrder from '../models/HelpOrder';

class HelpOrderController {
    async index(req, res) {
        const { id: student_id } = req.params;

        /**
         * Check if student exists
         */
        const student = await Student.findByPk(student_id);

        if (!student) {
            return res.status(400).json({ error: 'Student not found' });
        }

        const { page = 1 } = req.query;

        const helpOrders = await HelpOrder.findAll({
            order: ['answer_at'],
            attributes: ['id', 'question', 'answer', 'answer_at'],
            limit: 20,
            offset: (page - 1) * 20,
            where: { student_id },
        });

        return res.json(helpOrders);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            question: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { id: student_id } = req.params;

        /**
         * Check if student exists
         */
        const student = await Student.findByPk(student_id);

        if (!student) {
            return res.status(400).json({ error: 'Student not found' });
        }

        const { question } = await HelpOrder.create({
            student_id,
            ...req.body,
        });

        return res.json({ student_id, question });
    }
}

export default new HelpOrderController();
