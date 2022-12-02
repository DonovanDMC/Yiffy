const now = process.hrtime.bigint();

setTimeout(() => {
    const later = process.hrtime.bigint();
    console.log(`Time elapsed: ${Math.trunc(Number(later - now) / 100000)}ms`);
}, 1000)
