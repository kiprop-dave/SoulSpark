import { createWriteStream } from 'fs'
import { PrismaClient, Profile } from "@prisma/client";
import { hashPassword } from "../src/utils/password";
import { imageSchema, Image } from "../src/types";
import { z } from "zod";

const randomUser = z.object({
  gender: z.string().transform((g) => g[0].toUpperCase() + g.slice(1)),
  name: z.object({
    first: z.string(),
    last: z.string(),
  }).strip(),
  email: z.string(),
  login: z.object({
    password: z.string(),
  }).strip(),
  dob: z.object({
    date: z.string().transform((date) => new Date(date)),
  }).strip(),
  picture: z.object({
    medium: z.string(),
  }).strip(),
});

type RandomUser = z.infer<typeof randomUser>;

const lookingForOptions = [
  'Long term partner',
  'Long term,open to short term',
  'Short term,open to long term',
  'Short term fun',
  'New friends',
  'Still figuring it out'
];

const uploadImage = async (url: string): Promise<Image> => {
  const destination = 'https://api.cloudinary.com/v1_1/da1ehipve/image/upload';
  const uploadPreset = 'qfbtmcvf';
  const body = `file=${url}&upload_preset=${uploadPreset}`
  try {
    const response = await fetch(destination, {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    const data = await response.json();
    const image = imageSchema.parse(data);
    return image;
  } catch (err) {
    console.log(err);
    throw new Error('Error uploading image');
  }
}

const attractionOptions = ['Man', 'Woman', 'Other', 'All'];

const generateProfile = (user: RandomUser):
  Pick<Profile, "lookingFor" | "attraction" | "first_name" | "last_name" | "dateOfBirth" | "gender" | "minimumAge" | "maximumAge"> => {
  const lookingFor = lookingForOptions[Math.floor(Math.random() * lookingForOptions.length)];
  const attraction = attractionOptions[Math.floor(Math.random() * attractionOptions.length)];
  const minimumAge = Math.floor(Math.random() * 10) + 18;
  const maximumAge = minimumAge + Math.floor(Math.random() * 10) + 1;
  const gender = user.gender as "Male" | "Female" | "Other";
  return {
    lookingFor,
    attraction,
    first_name: user.name.first,
    last_name: user.name.last,
    dateOfBirth: user.dob.date,
    minimumAge,
    maximumAge,
    gender
  }
}

const fetchRandomUser = async () => {
  const response = await fetch("https://randomuser.me/api");
  const data = await response.json();
  const user = randomUser.parse(data.results[0]);
  return user;
}

const client = new PrismaClient();

const seedUsers = async () => {
  const usersCsv = createWriteStream('./users.csv');
  usersCsv.write("email,password\n");
  try {
    for (let i = 0; i < 100; i++) {
      const user = await fetchRandomUser();
      usersCsv.write(`${user.email},${user.login.password}\n`);
      const password = await hashPassword(user.login.password);
      const image = await uploadImage(user.picture.medium);
      const profile = generateProfile(user);
      await client.user.create({
        data: {
          email: user.email,
          password,
          profile: {
            create: {
              ...profile,
              images: {
                create: {
                  ...image,
                }
              }
            }
          }
        },
        include: {
          profile: true
        }
      })
    }
    usersCsv.end();
  } catch (err) {
    console.log(err);
  }
}

seedUsers().then(async () => {
  await client.$disconnect();
}).catch(async (err) => {
  console.log(err);
  await client.$disconnect();
});
