import Student from '../models/Student';
import Mail from '../../lib/Mail';

class AnswerMail {
    get key() {
        return 'AwnswerMail';
    }

    async handle({ data }) {
        const { student_id, question, answer } = data;

        const { name, email } = await Student.findByPk(student_id);

        await Mail.sendMail({
            to: `${name} <${email}>`,
            subject: 'Sua pergunta foi respondida!',
            template: 'answer',
            context: {
                name,
                question,
                answer,
            },
        });
    }
}

export default new AnswerMail();
