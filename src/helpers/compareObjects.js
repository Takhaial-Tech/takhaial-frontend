export const compareObjects = (obj1, obj2) =>
{
    const diffs = {};

    for (const key in obj2)
    {
        if (obj1.hasOwnProperty(key))
        {
            // Check for primitive types
            if (typeof obj2[key] === 'string' || typeof obj2[key] === 'number')
            {
                if (obj1[key] !== obj2[key])
                {
                    diffs[key] = obj2[key];
                }
            } else if (Array.isArray(obj2[key]))
            {
                // Custom comparison for  array of objects
                if (obj1[key].length !== obj2[key].length) diffs[key] = obj2[key];
                obj1[key].forEach((ele1, index1) =>
                {
                    obj2[key].forEach((ele2, index2) =>
                    {
                        if (JSON.stringify(ele1) !== JSON.stringify(ele2) && (index1 === index2))
                        {
                            diffs[key] = obj2[key];
                            return
                        }
                    })
                })
            } else if (obj2[key] instanceof Date)
            {
                // in case if date return it
                //  ob1 ele will be ISO date string 
                // so will be pass if not edited
                diffs[key] = obj2[key];
            }
        }
    }
    return diffs;
};
