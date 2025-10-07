import { ControllerBase, Endpoint } from 'nexus-nf';

interface MathPayload {
    first: number;
    second: number;
}

class MathController extends ControllerBase {
    constructor() {
        super('math', { queue: 'math-workers' });
    }

    @Endpoint('add')
    async add(payload: MathPayload) {
        const { first, second } = payload;
        return first + second;
    }

    @Endpoint('subtract')
    async subtract(payload: MathPayload) {
        const { first, second } = payload;
        return first - second;
    }

    @Endpoint('divide')
    async divide(payload: MathPayload) {
        const { first, second } = payload;
        return first / second;
    }

    @Endpoint('multiply')
    async multiply(payload: MathPayload) {
        const { first, second } = payload;
        return first * second;
    }
}

export default new MathController();
