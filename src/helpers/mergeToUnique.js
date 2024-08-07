export const mergeToUnique = (arr1, arr2) =>
{
    /**
     * Merges two arrays while ensuring unique _id values.
     *
     * @param {Array} arr1 - The first array to merge.
     * @param {Array} arr2 - The second array to merge.
     * @returns {Array} - A new array containing the merged elements with unique _id values.
     */

    // Check for empty arrays to handle edge cases efficiently
    if (!arr1 || !arr2) return arr1 || arr2;

    // Create a set to store unique _ids from arr1 for fast lookups
    const uniqueIds = new Set(arr1.map((item) => item._id));

    // Filter arr2 to only include elements with unique _ids that are not already in arr1
    const filteredArr2 = arr2.filter((item) => !uniqueIds.has(item._id));

    // Merge the filtered arr2 with arr1 to create the final merged array
    return [...arr1, ...filteredArr2];
}
