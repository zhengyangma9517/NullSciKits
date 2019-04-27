import { JustTools } from '../Kits/JustToolKit/just.tool.kit';

// Star Query
export class StarQuery {
    /**
     * Star Query will replace your **prefixed params into your parent object attributes.
     * For examplt, **name => parent.name
     * @param starQuery your star query
     * @param stars your parent object
     */
    public static starToCommon(starQuery: string, stars: any): string {
        let converted = starQuery;
        const regex = new RegExp(/\*\*\w*/, 'g');
        const matchedStars = converted.match(regex);
        if (JustTools.JustDetective.simpleDetect(matchedStars)) {
            for (let i = 0; i < matchedStars!.length; i++) {
                const key = matchedStars![i].replace(/\*\*/, '');
                if (Object.keys(stars).indexOf(key) !== -1) {
                    const value = stars[key];
                    if (JustTools.JustDetective.simpleDetect(value)) {
                        converted = converted.replace(matchedStars![i], value);
                    }
                }
            }
        }
        return converted;
    }
}
