import * as Yup from 'yup';

import HelpOrder from '../models/HelpOrder';
import AnswerMail from '../jobs/AnswerMail';
import Queue from '../../lib/Queue';

class HelpOrderAnswerController {
    async store(req, res) {
        const schema = Yup.object().shape({
            answer: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { id } = req.params;

        /**
         * Check if help order exists
         */
        const helpOrder = await HelpOrder.findByPk(id);

        if (!helpOrder) {
            return res.status(400).json({ error: 'Help order not found' });
        }

        const { student_id, question, answer } = await helpOrder.update({
            answer_at: new Date(),
            ...req.body,
        });

        await Queue.add(AnswerMail.key, { student_id, question, answer });

        return res.json({ question, answer });
    }
}

export default new HelpOrderAnswerController();
