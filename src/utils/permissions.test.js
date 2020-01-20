import { all, any, none } from './permissions';

const userQueryAdmin = {
    me: {
        roles: [{ name: 'ADMIN' }],
    }
};

const userQueryAdminCore = {
    me: {
        roles: [{ name: 'ADMIN' }, { name: 'CORE' }],
    }
};

it('permissions - check ALL', () => {
    expect(all(['ADMIN'])(userQueryAdmin)).toBe(true);
    expect(all(['CORE'])(userQueryAdmin)).toBe(false);
    expect(all(['CORE'])(userQueryAdminCore)).toBe(true);
    expect(all(['CORE', 'ADMIN'])(userQueryAdminCore)).toBe(true);
    expect(all(['CORE', 'ADMIN'])(userQueryAdmin)).toBe(false);
    expect(all([])(userQueryAdminCore)).toBe(true);
});

it('permissions - check ANY', () => {
    expect(any(['ADMIN'])(userQueryAdmin)).toBe(true);
    expect(any(['CORE'])(userQueryAdmin)).toBe(false);
    expect(any(['CORE'])(userQueryAdminCore)).toBe(true);
    expect(any(['CORE', 'ADMIN'])(userQueryAdminCore)).toBe(true);
    expect(any(['CORE', 'ADMIN'])(userQueryAdmin)).toBe(true);
    expect(any([])(userQueryAdminCore)).toBe(false);
});

it('permissions - check NONE', () => {
    expect(none(['ADMIN'])(userQueryAdmin)).toBe(false);
    expect(none(['CORE'])(userQueryAdmin)).toBe(true);
    expect(none(['CORE'])(userQueryAdminCore)).toBe(false);
    expect(none(['CORE', 'ADMIN'])(userQueryAdminCore)).toBe(false);
    expect(none(['CORE', 'ADMIN'])(userQueryAdmin)).toBe(false);
    expect(none([])(userQueryAdminCore)).toBe(true);
});
