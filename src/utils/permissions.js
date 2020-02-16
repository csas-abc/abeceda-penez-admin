import compose from 'ramda/src/compose';
import curry from 'ramda/src/curry';
import allR from 'ramda/src/all';
import anyR from 'ramda/src/any';
import noneR from 'ramda/src/none';
import includes from 'ramda/src/includes';
import pluck from 'ramda/src/pluck';
import pathOr from 'ramda/src/pathOr';

const genericHandler = curry((conditionHandler, roles, meQuery) =>
    conditionHandler((role) => compose(
        includes(role),
        pluck('name'),
        pathOr([], ['me', 'roles']),
    )(meQuery))(roles)
);

export const all = genericHandler(allR);
export const any = genericHandler(anyR);
export const none = genericHandler(noneR);
