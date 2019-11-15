import { format, parseISO } from 'date-fns';
import Mail from '../../lib/Mail';
import Student from '../models/Student';
import Plan from '../models/Plan';

class WelcomeMail {
    get key() {
        return 'WelcomeMail';
    }

    async handle({ data }) {
        const { plan_id, student_id, end_date, price } = data;

        const plan = await Plan.findByPk(plan_id);
        const student = await Student.findByPk(student_id);

        await Mail.sendMail({
            to: `${student.name} <${student.email}>`,
            subject: 'Seja bem vindo!',
            template: 'welcome',
            context: {
                student: student.name,
                plan: plan.title,
                end_date: format(parseISO(end_date), 'dd/MM/yyyy'),
                price,
            },
        });
    }
}

export default new WelcomeMail();
