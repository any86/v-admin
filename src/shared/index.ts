import { http } from '@/http';

export function walkTree<Node extends { children?: Node[] }>(nodes: Node[], each: (node: Node) => void) {
    const stack: Node[] = [];
    _filter(nodes, each, stack);
    while (stack.length > 0) {
        const node = stack.pop()!;
        if (node.children?.length) {
            _filter(node.children, each, stack);
        }
    }

    function _filter(nodes: Node[], each: (node: Node) => void, stack: Node[]) {
        let { length } = nodes
        for (let i = 0; i < length; i++) {
            const node = nodes[i];
            if (void 0 === each(node)) {
                nodes.splice(i, 1);
                length--;
                i--;
            } else {
                stack.push(node);
            }
        }
    }
}


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





