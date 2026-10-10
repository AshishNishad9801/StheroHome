const buildUrl = (id: string, w = 1600, h?: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}${h ? `&h=${h}` : ''}&fit=crop`;

export const heroImages = [
  {
    url: buildUrl('1571460', 1920),
    alt: 'Bright bedroom with large windows and warm natural light',
  },
  {
    url: buildUrl('7546648', 1920),
    alt: 'Stylish shared living room with comfortable seating and natural light',
  },
  {
    url: buildUrl('4781426', 1920),
    alt: 'Friends relaxing together in a sunlit kitchen',
  },
  {
    url: buildUrl('7746954', 1920),
    alt: 'Cozy loft bedroom with large window and warm tones',
  },
];

export const storyImage = {
  url: buildUrl('33693802', 1400),
  alt: 'Cozy bedroom bathed in sunlight with potted plants on the windowsill',
};

export const galleryImages = [
  {
    url: buildUrl('10554480', 900, 1200),
    alt: 'Serene white bedroom with natural light and minimalistic decor',
    className: 'col-span-2 row-span-2 md:col-span-3 md:row-span-2',
  },
  {
    url: buildUrl('7195743', 900, 700),
    alt: 'Comfortable couch with cushions near a coffee table in a light modern apartment',
    className: 'col-span-2 row-span-1 md:col-span-2 md:row-span-1',
  },
  {
    url: buildUrl('3673513', 700, 1000),
    alt: 'Warm workspace with a laptop on a wooden desk illuminated by a lamp',
    className: 'col-span-1 row-span-2 md:col-span-1 md:row-span-2',
  },
  {
    url: buildUrl('6489112', 900, 700),
    alt: 'Modern kitchen with dining table and stylish cabinetry',
    className: 'col-span-2 row-span-1 md:col-span-2 md:row-span-1',
  },
  {
    url: buildUrl('4778421', 900, 700),
    alt: 'Group of friends relaxing and chatting in a sunlit space',
    className: 'col-span-2 row-span-1 md:col-span-2 md:row-span-1',
  },
];

export const onboardingImage = {
  url: buildUrl('14715848', 1200),
  alt: 'Inviting bedroom with decorative pillows and warm sunlight filtering through windows',
};

export const closingImage = {
  url: buildUrl('13009040', 1920),
  alt: 'Tranquil bedroom interior bathed in warm sunrise light through the window',
};

export const aboutHeroImages = [
  {
    url: buildUrl('7587783', 1920),
    alt: 'Contemporary living room with comfortable sectional sofa and warm light',
  },
  {
    url: buildUrl('1571460', 1920),
    alt: 'Bright bedroom with natural sunlight and warm neutral tones',
  },
];

export const aboutStoryImage = {
  url: buildUrl('7746082', 1200),
  alt: 'Stylish contemporary bedroom with geometric wallpaper and natural light',
};

export const aboutGalleryImages = [
  {
    url: buildUrl('10446865', 800, 1100),
    alt: 'Cozy modern living room with stylish sofa and abstract wall art',
    className: 'col-span-2 row-span-2',
  },
  {
    url: buildUrl('30386965', 800, 600),
    alt: 'Stylish modern kitchen interior with warm lighting',
    className: 'col-span-2 row-span-1',
  },
  {
    url: buildUrl('13334794', 800, 600),
    alt: 'Two people sharing a joyful morning in a kitchen',
    className: 'col-span-2 row-span-1',
  },
  {
    url: buildUrl('35929306', 600, 800),
    alt: 'Serene living room corner with soft lighting and comfortable cushions',
    className: 'col-span-1 row-span-2',
  },
  {
    url: buildUrl('19342309', 800, 600),
    alt: 'Warm and inviting home desk setup with books and candles',
    className: 'col-span-2 row-span-1',
  },
];

export const aboutClosingImage = {
  url: buildUrl('20290913', 1920),
  alt: 'Spacious modern living room with sleek design and abundant natural light',
};

export const imageComposition = [
  {
    url: buildUrl('7167073', 1200),
    alt: 'Stylish living room with comfortable sofa and colorful pillows',
    className: 'col-span-7 row-span-2',
  },
  {
    url: buildUrl('10511472', 600, 800),
    alt: 'Bright and airy bedroom with wooden floor and modern decor',
    className: 'col-span-5 row-span-1',
  },
  {
    url: buildUrl('6934265', 600, 800),
    alt: 'Studio apartment with comfortable armchairs near a fireplace',
    className: 'col-span-5 row-span-1',
  },
];
