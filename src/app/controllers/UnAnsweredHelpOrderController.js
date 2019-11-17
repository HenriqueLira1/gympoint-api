import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderController {
    async index(req, res) {
        const { page = 1 } = req.query;

        const helpOrders = await HelpOrder.findAll({
            order: ['answer_at'],
            attributes: ['id', 'question'],
            limit: 20,
            offset: (page - 1) * 20,
            where: { answer_at: null },
            include: [
                {
                    model: Student,
                    as: 'student',
                    attributes: ['id', 'name', 'email'],
                },
            ],
        });

        return res.json(helpOrders);
    }
}

export default new HelpOrderController();
