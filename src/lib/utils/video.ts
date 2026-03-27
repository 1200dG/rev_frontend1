export const getVideoPath = (local: string, prod:string): string => {
    return process.env.NEXT_PUBLIC_NODE_ENV === 'development' ? local : prod;
};