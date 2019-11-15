import Bee from 'bee-queue';
import redisConfig from '../config/redis';

import WelcomeMail from '../app/jobs/WelcomeMail';

const jobs = [WelcomeMail];

class Queue {
    constructor() {
        this.queues = {};

        this.init();
    }

    init() {
        jobs.forEach(({ key, handle }) => {
            this.queues[key] = {
                bee: new Bee(key, {
                    redis: redisConfig,
                }),
                handle,
            };
        });
    }

    add(queue, data) {
        return this.queues[queue].bee.createJob(data).save();
    }

    processQueue() {
        jobs.forEach(({ key }) => {
            const { bee, handle } = this.queues[key];

            bee.on('failed', this.handleFailure).process(handle);
        });
    }

    handleFailure(job, err) {
        console.log(`Queue ${job.queue.name}: FAILED`, err);
    }
}

export default new Queue();
