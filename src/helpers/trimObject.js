export const trimObject = (obj) =>
{
    for (let key in obj)
    {
        if (typeof obj[key] === "string")
        {
            obj[key] = obj[key].trim();
        }
    }
    return obj;
}