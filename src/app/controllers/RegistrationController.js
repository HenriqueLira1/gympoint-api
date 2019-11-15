import * as Yup from 'yup';
import { parseISO, isBefore } from 'date-fns';

import Registration from '../models/Registration';
import Plan from '../models/Plan';
import Student from '../models/Student';

class RegistrationController {
    async index(req, res) {
        const { page = 1 } = req.query;

        const registrations = await Registration.findAll({
            order: ['start_date'],
            attributes: ['id', 'start_date', 'end_date', 'price'],
            limit: 20,
            offset: (page - 1) * 20,
            include: [
                {
                    model: Plan,
                    as: 'plan',
                    attributes: ['id', 'title'],
                },
                {
                    model: Student,
                    as: 'student',
                    attributes: ['name', 'email'],
                },
            ],
        });

        return res.json(registrations);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            student_id: Yup.number(),
            plan_id: Yup.number(),
            start_date: Yup.date(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { id } = req.params;

        /**
         * Check if registration id is valid
         */
        const registration = await Registration.findByPk(id);

        if (!registration) {
            return res.status(400).json({ error: 'Registration not found' });
        }

        const { student_id, plan_id, start_date } = req.body;

        /**
         * Check if plan is valid
         */
        if (plan_id) {
            const checkPlan = await Plan.findByPk(plan_id);

            if (!checkPlan) {
                return res.status(400).json({ error: 'Plan not found' });
            }
        }

        /**
         * Check if student is valid
         */
        if (student_id) {
            const checkStudent = await Student.findByPk(student_id);

            if (!checkStudent) {
                return res.status(400).json({ error: 'Student not found' });
            }
        }

        /**
         * Check for past dates
         */
        if (start_date) {
            const formatedStartDate = parseISO(start_date);

            if (isBefore(formatedStartDate, new Date())) {
                return res
                    .status(400)
                    .json({ error: 'Past dates are not allowed' });
            }
        }

        const { end_date, price } = await registration.update(req.body);

        return res.json({ id, start_date, end_date, price });
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            student_id: Yup.number().required(),
            plan_id: Yup.number().required(),
            start_date: Yup.date().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { student_id, plan_id, start_date } = req.body;

        /**
         * Check if given plan is valid
         */
        const checkPlan = await Plan.findByPk(plan_id);

        if (!checkPlan) {
            return res.status(400).json({ error: 'Plan not found' });
        }

        /**
         * Check if given student is valid
         */
        const checkStudent = await Student.findByPk(student_id);

        if (!checkStudent) {
            return res.status(400).json({ error: 'Student not found' });
        }

        /**
         * Check for past dates
         */

        const formatedStartDate = parseISO(start_date);

        if (isBefore(formatedStartDate, new Date())) {
            return res
                .status(400)
                .json({ error: 'Past dates are not allowed' });
        }

        const { end_date, price } = await Registration.create(req.body);

        return res.json({ start_date, end_date, price });
    }

    async delete(req, res) {
        const { id } = req.params;
        const registration = await Registration.findByPk(id);

        if (!registration) {
            return res.status(400).json({ error: 'Registration not found' });
        }

        await registration.destroy();

        return res.json(id);
    }
}

export default new RegistrationController();
