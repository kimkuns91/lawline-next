'use server';

import prisma from '../prisma';

export async function getAIModels() {
  'use server';
  try {
    const aiModels = await prisma.aIModel.findMany();
    return aiModels;
  } catch (error) {
    console.error('getAIModels error : ', error);
    return [];
  }
}
