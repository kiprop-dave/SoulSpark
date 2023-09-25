import { createWriteStream } from 'fs';
import { PrismaClient, Profile, Prisma } from '@prisma/client';
import { hashPassword } from '../src/utils/password';
import { imageSchema, Image } from '../src/types';
import { z } from 'zod';

const randomUser = z.object({
  gender: z.string().transform((g) => g[0].toUpperCase() + g.slice(1)),
  name: z
    .object({
      first: z.string(),
      last: z.string(),
    })
    .strip(),
  email: z.string(),
  login: z
    .object({
      password: z.string(),
    })
    .strip(),
  dob: z
    .object({
      date: z.string().transform((date) => new Date(date)),
    })
    .strip(),
  picture: z
    .object({
      medium: z.string(),
    })
    .strip(),
});

type RandomUser = z.infer<typeof randomUser>;

const lookingForOptions = [
  'Long term partner',
  'Long term,open to short term',
  'Short term,open to long term',
  'Short term fun',
  'New friends',
  'Still figuring it out',
];

const uploadImage = async (url: string): Promise<Image | null> => {
  const destination = 'https://api.cloudinary.com/v1_1/da1ehipve/image/upload';
  const uploadPreset = process.env.UPLOAD_PRESET;
  const body = `file=${url}&upload_preset=${uploadPreset}`;
  try {
    const response = await fetch(destination, {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const data = await response.json();
    const image = imageSchema.safeParse(data);
    if (image.success) {
      return image.data;
    } else {
      return null;
    }
  } catch (err) {
    console.log('Error uploading image');
    throw new Error('Error uploading image');
  }
};

const attractionOptions = ['Man', 'Woman', 'Other', 'All'];

type GeneratedProfile = Pick<
  Profile,
  | 'lookingFor'
  | 'attraction'
  | 'first_name'
  | 'last_name'
  | 'dateOfBirth'
  | 'gender'
  | 'minimumAge'
  | 'maximumAge'
>;
const generateProfile = (user: RandomUser): GeneratedProfile => {
  const lookingFor = lookingForOptions[Math.floor(Math.random() * lookingForOptions.length)];
  const attraction = attractionOptions[Math.floor(Math.random() * attractionOptions.length)];
  const minimumAge = Math.floor(Math.random() * 10) + 18;
  const maximumAge = minimumAge + Math.floor(Math.random() * 10) + 1;
  const gender = user.gender as 'Male' | 'Female' | 'Other';
  return {
    lookingFor,
    attraction,
    first_name: user.name.first,
    last_name: user.name.last,
    dateOfBirth: user.dob.date,
    minimumAge,
    maximumAge,
    gender,
  };
};

const fetchRandomUsers = async (n: number): Promise<RandomUser[]> => {
  try {
    const users = await fetch(`https://randomuser.me/api/?results=${n}&password=upper,lower,8-10`);
    const data = await users.json();
    let validResults: RandomUser[] = [];
    data.results.forEach((user: any) => {
      const randomAge = Math.floor(Math.random() * 15) + 18;
      const parseRes = randomUser.safeParse(user);
      if (parseRes.success) {
        const user = parseRes.data;
        user.dob.date = new Date(new Date().setFullYear(new Date().getFullYear() - randomAge));
        validResults.push(user);
      }
    });
    return validResults;
  } catch (err) {
    console.error('Error fetching random users');
    throw new Error('Error fetching random users');
  }
};

const client = new PrismaClient();

const createUserAndProfile = async (
  email: string,
  password: string,
  profile: GeneratedProfile,
  images: string[]
) => {
  try {
    await client.user.create({
      data: {
        email: email,
        password,
        profile: {
          create: {
            ...profile,
            images: {
              connect: images.map((id) => ({ id })),
            },
          },
        },
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('constraint violation', err.message);
    } else if (err instanceof Prisma.PrismaClientValidationError) {
      console.error('validation error', err.message);
    } else if (err instanceof Prisma.PrismaClientInitializationError) {
      console.error('initialization error', err.message);
    } else if (err instanceof Prisma.PrismaClientRustPanicError) {
      console.error('rust panic', err.message);
    } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
      console.error('unknown request error', err.message);
    } else {
      console.error('Unknown error creating user and profile');
      throw new Error('Error creating user and profile');
    }
  }
};

const saveImagesToDb = async (images: Image[]): Promise<string[]> => {
  try {
    const results = await Promise.allSettled(
      images.map(async (image) => {
        const res = await client.digitalAsset.create({
          data: image,
        });
        return res.id;
      })
    );
    return results
      .map((result) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          console.log(result.reason);
          return null;
        }
      })
      .filter((id) => id !== null) as string[];
  } catch (err) {
    console.error('Error saving images to db');
    throw new Error('Error saving images to db');
  }
};

const unsplashRespose = z.object({
  results: z.array(
    z
      .object({
        urls: z
          .object({
            regular: z.string(),
          })
          .strip(),
      })
      .strip()
  ),
});

type UnsplashResponse = z.infer<typeof unsplashRespose>;

const fetchUnsplashImages = async (queries: string[]): Promise<string[]> => {
  const results = await Promise.allSettled(
    queries.map(async (query) => {
      const destination = `https://api.unsplash.com/search/photos?query=${query}&per_page=40&orientation=portrait`;
      const res = await fetch(destination, {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      });
      const json = await res.json();
      const images = await unsplashRespose.parseAsync(json);
      return images.results.map((el) => el.urls.regular);
    })
  );

  let images: string[] = [];
  return results.reduce((acc, curr) => {
    if (curr.status === 'fulfilled') {
      return [...acc, ...curr.value];
    }
    return acc;
  }, images);
};

const uploadImages = async (imagesUrls: string[]): Promise<Image[]> => {
  try {
    const images = await Promise.allSettled(
      imagesUrls.map(async (url) => {
        const image = await uploadImage(url);
        return image;
      })
    );
    const res = images
      .map((image) => {
        if (image.status === 'fulfilled') {
          return image.value;
        }
      })
      .filter((image) => image !== undefined && image !== null) as Image[];
    return res;
  } catch (err) {
    console.error('error uploading images');
    throw new Error('Error uploading images');
  }
};

const seedUsers = async () => {
  const usersCsv = createWriteStream('./users.csv');
  usersCsv.write('email,password\n');
  try {
    const queries = [
      'white women',
      'asian men',
      'black women',
      'indian men',
      'indian women',
      'black men',
      'white men',
      'asian women',
      'european women',
      'european men',
      'middle eastern men',
      'middle eastern women',
    ];
    const images = await fetchUnsplashImages(queries);
    const imagesUploaded = await uploadImages(images);
    const savedImages = await saveImagesToDb(imagesUploaded);
    const len = savedImages.length;
    console.log(`Images uploaded: ${len}`);
    const users = await fetchRandomUsers(120);
    const imagesPerUser = Math.floor(len / users.length);
    if (imagesPerUser < 1) {
      console.log('Images not uploaded');
      return;
    }
    for (let i = 0; i < users.length; i++) {
      try {
        const user = users[i];
        const password = await hashPassword(user.login.password);
        const profile = generateProfile(user);
        const imagesIds = savedImages.slice(i * imagesPerUser, (i + 1) * imagesPerUser);
        await createUserAndProfile(user.email, password, profile, imagesIds);
        usersCsv.write(`${user.email},${user.login.password}\n`);
      } catch (err) {
        console.log(err);
        continue;
      }
    }
    usersCsv.end();
  } catch (err) {
    throw new Error('Error seeding users');
  }
};

// seedUsers().then(async () => {
//   await client.$disconnect();
// }).finally(async () => {
//   await client.$disconnect();
// });
const likesSeed = async () => {
  try {
    const allUsers = await client.user.findMany({
      select: {
        email: true,
        id: true,
      },
    });
    const me = allUsers.find((user) => user.email === '');
    if (!me) {
      return;
    }
    await Promise.allSettled(
      allUsers.map(async (user) => {
        if (user.email === me.email) {
          return;
        } else {
          await client.user.update({
            where: {
              email: user.email,
            },
            data: {
              likes: {
                connect: {
                  id: me.id,
                },
              },
            },
          });
        }
      })
    );
  } catch (err) {
    console.log(err);
  }
};
likesSeed()
  .then(() => {
    console.log('done');
  })
  .finally(async () => {
    await client.$disconnect();
  });
