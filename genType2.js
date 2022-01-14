const input = `
{
    "totalSales": {
        "total": "958349",
        "weekCompared": "22",
        "dayCompared": "97",
        "dayTotal": "8670"
    },
    "order": {
        "total": "55984",
        "paid": "43354",
        "dayTotal": "2460"
    },
    "salesRanking": {
        "list": [
            {
                "title": "苹果手机",
                "totalSales": "73645"
            },
            {
                "title": "苹果手机",
                "totalSales": "55670"
            },
            {
                "title": "苹果手机",
                "totalSales": "41519"
            }
        ]
    },
    "activityResults": {
        "percent": 57,
        "totalOrder": "679808"
    }
}
`
function genType(input, space = '    ') {
    const json = JSON.parse(input);
    const typeArray = [`type ResponseData=`];

    /**
     * 遍历
     * @param {*} node 
     * @param {*} propsName 
     * @param {*} level 
     */
    function walk(node, propsName, level = 0) {
        const indent = space.repeat(level);
        if ('[object Object]' === Object.prototype.toString.call(node)) {
            if (void 0 === propsName) {
                typeArray.push(`${indent}{`);
            } else {
                typeArray.push(`${indent}${propsName}:{`);
            }
            for (let key in node) {
                walk(node[key], key, level + 1);
            }
            typeArray.push(`${indent}};`);
        } else if ('[object Array]' === Object.prototype.toString.call(node)) {
            // wip
            walk(node[0], propsName, level);
            const last = typeArray.pop();
            typeArray.push(last.replace(';', '[];'))
            // for(let childNode of node){
            //     walk(childNode, propsName, level+1);
            // }
        } else {
            if (void 0 === propsName) {
                typeArray.push(`${indent}${typeof node}`);
            } else {
                typeArray.push(`${indent}${propsName}:${typeof node}`);
            }
        }
    }
    walk(json);
    console.log(typeArray.join('\r\n'));
}

genType(input);


function isSameSchema() {

}