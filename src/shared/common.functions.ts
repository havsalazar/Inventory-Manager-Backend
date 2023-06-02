
export function chunkArray (array: any[], chunkSize: number): any[][]{
    const chunkedArray: any[][] = [];

    while (array.length > 0) {
        chunkedArray.push(array.splice(0, chunkSize));
    }

    return chunkedArray;
}


