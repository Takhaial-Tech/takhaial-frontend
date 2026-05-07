export const compareObjects = (obj1, obj2) =>
{
    const diffs = {};
    const initialObject = obj1 || {};

    for (const key in obj2)
    {
        if (!Object.prototype.hasOwnProperty.call(initialObject, key))
        {
            diffs[key] = obj2[key];
        }
        else
        {
            // Check for primitive types
            if (typeof obj2[key] === 'string' || typeof obj2[key] === 'number')
            {
                if (initialObject[key] !== obj2[key])
                {
                    diffs[key] = obj2[key];
                }
            } else if (Array.isArray(obj2[key]))
            {
                // Custom comparison for  array of objects
                if (!Array.isArray(initialObject[key]))
                {
                    diffs[key] = obj2[key];
                    continue;
                }

                if (initialObject[key].length !== obj2[key].length) diffs[key] = obj2[key];
                initialObject[key].forEach((ele1, index1) =>
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
