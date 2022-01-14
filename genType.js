const axios = require('axios');
const url = 'http://127.0.0.1:4523/export/openapi?projectId=486559&specialPurpose=openapi-generator';


axios.get(url).then((result) => {
    const { schema } = result.data.paths['/api/summary'].get.responses[200].content['application/json'];
    // const { schema } = result.data.paths['/api/user'].get.responses[200].content['application/json'];
    genType(schema);
}).catch((err) => {
    console.log(err);
});


function genType(schema, space = '    ') {
    const typeArray = [`type ResponseData=`];

    function walk(node, key, level = 0) {
        const { type } = node;
        const indent = space.repeat(level)
        if ('object' === type) {
            typeArray.push(indent + (key ? `${key}:{` : '{'));
            let childNode;
            for (let key in node.properties) {
                childNode = node.properties[key];
                walk(childNode, key, level + 1);
            }
            typeArray.push(`${indent}};`);
        } else if ('array' === type) {
            typeArray.push(indent + (key ? `${key}:` : ''));
            walk(node.items, void 0, level + 1);
            // typeArray.push(`[];`);
            const last = typeArray.pop();
            typeArray.push(last.replace(';', `[];`));
        } else {
            typeArray.push(`${indent}${key || ''}:${getNativeType(node.type)};`);
        }
    }
    walk(schema);
    console.log(typeArray.join('\r\n'));
}

function getNativeType(type) {
    if (['integer'].includes(type)) {
        return 'number';
    } else {
        return type;
    }
}