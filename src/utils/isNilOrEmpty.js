import isNil from 'ramda/src/isNil';
import isEmpty from 'ramda/src/isEmpty';
import anyPass from 'ramda/src/anyPass';

export default anyPass([isNil, isEmpty]);
