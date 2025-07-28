import { Controller, Endpoint } from 'nexus-nf';

interface MathPayload {
    first: number;
    second: number;
}

@Controller('math')
class MathController {
    @Endpoint('add')
    async add(payload: MathPayload) {
        const { first, second } = payload;
        return first + second;
    }

    @Endpoint('subtract')
    async substract(payload: MathPayload) {
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
