export const userQuery = (userId) => {
  const query = `*[_type == "user" && _id == '${userId}']`;

  return query;
};

export const searchQuery = (searchTerm) => {
  const query = `*[_type=="pin" && title match '${searchTerm}*' || category match '${searchTerm}*' || about match '${searchTerm}*']{
    image{
      asset->{url}
    },
    _id,
    destination,
    postedBy -> {
      _id,
      userName,
      image
    },
    save[]{
      _key,
      postedBy ->{
        _id,
        userName,
        image
      }
    },
  }`;

  return query;
};

export const feedQuery = `*[_type == 'pin'] | order(_createAt desc){
  image{
    asset->{url}
  },
  _id,
  destination,
  postedBy -> {
    _id,
    userName,
    image
  },
  save[]{
    _key,
    postedBy ->{
      _id,
      userName,
      image
    }
  },
}`;

export const categories = [
  {
    name: "fitness",
    image:
      "https://i.pinimg.com/236x/f1/bc/46/f1bc46a2699af116de0778251a9b7081.jpg",
  },
  {
    name: "websites",
    image:
      "https://i.pinimg.com/236x/c6/f8/6f/c6f86ff81d6342cac1bf82f227d5ae96.jpg",
  },
  {
    name: "nature",
    image:
      "https://i.pinimg.com/236x/ac/3e/ea/ac3eeab10c2ad507bb0c9f6f13e0be7a.jpg",
  },
  {
    name: "art",
    image:
      "https://i.pinimg.com/236x/d6/8f/0b/d68f0b344439e1b610cfb08674276b34.jpg",
  },
  {
    name: "voyage",
    image:
      "https://i.pinimg.com/564x/d5/1f/e4/d51fe4f6e679097db4cf10bc311a6d2f.jpg",
  },
  {
    name: "quotes",
    image:
      "https://i.pinimg.com/564x/e8/f1/cf/e8f1cfc18c4a9333555ab1ed672928b3.jpg",
  },
  {
    name: "gaming",
    image:
      "https://i.pinimg.com/564x/33/07/71/33077153534adc0e671279f12a5f9091.jpg",
  },
  {
    name: "others",
    image:
      "https://i.pinimg.com/564x/8f/e2/af/8fe2afd487038416e1719111a879ac5c.jpg",
  },
];

export const pinDetailQuery = (pinId) => {
  const query = `*[_type == "pin" && _id == '${pinId}']{
    image{
      asset->{
        url
      }
    },
    _id,
    title, 
    about,
    category,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
   save[]{
      postedBy->{
        _id,
        userName,
        image
      },
    },
    comments[]{
      comment,
      _key,
      postedBy->{
        _id,
        userName,
        image
      },
    }
  }`;
  return query;
};

export const pinDetailMorePinQuery = (pin) => {
  const query = `*[_type == "pin" && category == '${pin.category}' && _id != '${pin._id}' ]{
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      _key,
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
  return query;
};

export const userCreatedPinsQuery = (userId) => {
  const query = `*[ _type == 'pin' && userId == '${userId}'] | order(_createdAt desc){
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
  return query;
};

export const userSavedPinsQuery = (userId) => {
  const query = `*[_type == 'pin' && '${userId}' in save[].userId ] | order(_createdAt desc) {
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
  return query;
};
