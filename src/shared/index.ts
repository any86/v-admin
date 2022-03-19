import { http } from '@/http';
/**
 * 获取职位列表
 * @returns promise 列表
 */
export async function getPositionOptions() {
    const { data } = await http.get<{ id: string; name: string }[]>('/global/position');
    return data.map(({ id, name }) => {
        return { label: name, value: id };
    });
}

/**
 * 获取部门列表
 * @returns promise 列表
 */
export async function getDepartmentOptions() {
    const { data } = await http.get<{ id: string; name: string }[]>('/global/department');
    return data.map(({ id, name }) => {
        return { label: name, value: id };
    });
}

/**
 * 获取角色列表
 * @returns promise 列表
 */
export async function getRoleOptions() {
    const { data } = await http.get<{ id: string; name: string }[]>('/global/role');
    return data.map(({ id, name }) => {
        return { label: name, value: id };
    });
}





