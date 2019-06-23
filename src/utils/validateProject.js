import path from 'ramda/src/path';
import moment from 'moment';

export default (classroom) => {
    // STEP 2 --> finished in 14 days from step 1 finish date
    if (path(['phases', 0, 'finished'])(classroom) && !path(['phases', 1, 'finished'])(classroom)) {
        return moment(path(['phases', 0, 'finishDate'])(classroom)).add(14, 'days').isBefore(moment());
    }

    // STEP 3 --> finished in 3 weeks from step 1 finish date
    if (path(['phases', 0, 'finished'])(classroom) && !path(['phases', 2, 'finished'])(classroom)) {
        return moment(path(['phases', 0, 'finishDate'])(classroom)).add(3, 'weeks').isBefore(moment());
    }

    // STEP 4 --> finished in 14 from step 2 finish date
    if (path(['phases', 1, 'finished'])(classroom) && !path(['phases', 3, 'finished'])(classroom)) {
        return moment(path(['phases', 1, 'finishDate'])(classroom)).add(14, 'days').isBefore(moment());
    }

    // STEP 5 --> finished in one month from step 4 finish date
    if (path(['phases', 3, 'finished'])(classroom) && !path(['phases', 4, 'finished'])(classroom)) {
        return moment(path(['phases', 3, 'finishDate'])(classroom)).add(1, 'month').isBefore(moment());
    }

    // STEP 6 --> finished in 14 days from step 5 finish date
    if (path(['phases', 4, 'finished'])(classroom) && !path(['phases', 5, 'finished'])(classroom)) {
        return moment(path(['phases', 4, 'finishDate'])(classroom)).add(14, 'days').isBefore(moment());
    }

    // STEP 7 --> finished in 10 weeks from step 4 finish date
    if (path(['phases', 3, 'finished'])(classroom) && !path(['phases', 6, 'finished'])(classroom)) {
        return moment(path(['phases', 3, 'finishDate'])(classroom)).add(10, 'weeks').isBefore(moment());
    }

    // STEP 7 --> finished in 10 weeks from step 4 finish date
    if (path(['phases', 6, 'finished'])(classroom) && !path(['phases', 7, 'finished'])(classroom)) {
        return moment(path(['phases', 6, 'finishDate'])(classroom)).add(1, 'week').isBefore(moment());
    }
}
