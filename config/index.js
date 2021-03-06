import article from './article';
import getFlags from './flags';
import getOnwardJourney from './onward-journey';
import people from './people';
import _ from 'lodash';

export default async function() {
  const d = await article();
  const flags = await getFlags();
  const onwardJourney = await getOnwardJourney();

  // Groups the people by category
  const groups = _.groupBy(people, person => person.category);

  // This decides the order of the groups
  const allGroups = people.map(p => p.category);
  const groupNames = _.uniq(allGroups);

  const sortedGroups = groupNames.map(name => {

    const intro = groups[name].reduce(function( previous, current ){
      if(current.intro) return current.intro;
      return previous;
    }, '');

    return {
      name: name,
      intro: intro,
      people: groups[name],
    };
  });


  //console.log(sortedGroups)
  /*
  An experimental demo that gets content from the API
  and overwrites some model values. This requires the Link File
  to have been published. Also next-es-interface.ft.com probably
  isn't a reliable source. Also this has no way to prevent development
  values being seen in productions... use with care.

  try {
    const a = (await axios(`https://next-es-interface.ft.com/content/${d.id}`)).data;
    d.headline = a.title;
    d.byline = a.byline;
    d.summary = a.summaries[0];
    d.title = d.title || a.title;
    d.description = d.description || a.summaries[1] || a.summaries[0];
    d.publishedDate = new Date(a.publishedDate);
    f.comments = a.comments;
  } catch (e) {
    console.log('Error getting content from content API');
  }

  */

  return {
    ...d,
    groups: sortedGroups,
    flags,
    onwardJourney,
  };
}
