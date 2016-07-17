import './ChampionUpgrade.scss';
import { TYPE_VALUES } from '../../data/model/Type';
import { STAR_RANK_LEVEL, CATALYSTS, CATALYST } from '../../data/model/Champion';
import ImageIcon from '../ImageIcon.jsx';
import lang from '../../service/lang';
import classnames from 'classnames';
/* eslint-disable no-unused-vars */
import m from 'mithril';
/* eslint-enable no-unused-vars */

const ChampionUpgrades = {
    view(ctrl, { champions }) {
        const catalysts = champions
            // filter out non-upgrading champions
            .filter(({ attr }) => {
                const definitionStars = STAR_RANK_LEVEL[ attr.stars ];
                const definitionRank = definitionStars[ attr.rank ];
                return definitionStars.ranks > attr.rank && definitionRank.levels === attr.level;
            })
            // map upgrades needed
            .map(({ attr }) => ({
                catalysts: CATALYSTS[ attr.stars ] && CATALYSTS[ attr.stars ][ attr.rank ],
                typeId: attr.typeId,
                typeIndex: TYPE_VALUES.indexOf(attr.typeId),
            }))
            // add to the right category
            .reduce((collection, { catalysts, typeId, typeIndex }) => {
                catalysts.forEach(({ type, tier, amount }) => {
                    if(type === CATALYST.GOLD) {
                        collection[ type ] += amount;
                    }
                    else if(type === CATALYST.BASIC || type === CATALYST.ALPHA) {
                        collection[ type ].push({
                            type,
                            tier,
                            amount,
                        });
                    }
                    else if (type === CATALYST.CLASS) {
                        collection[ type ].push({
                            type,
                            tier,
                            amount,
                            typeId,
                            typeIndex,
                        });
                    }
                });
                return collection;
            }, {
                [ CATALYST.BASIC ]: [],
                [ CATALYST.CLASS ]: [],
                [ CATALYST.ALPHA ]: [],
                [ CATALYST.GOLD ]: 0,
            });

        [ 'basic', 'class', 'alpha' ].forEach((type) => {
            catalysts[ type ] = catalysts[ type ]
                // sort by tier ascending
                .sort((type === CATALYST.CLASS)?
                    ({ tier: tA, typeIndex: tyA }, { tier: tB, typeIndex: tyB }) => {
                        const compare = tA - tB;
                        if(compare !== 0) {
                            return compare;
                        }
                        return tyA - tyB;
                    }: ({ tier: tA }, { tier: tB }) => tA - tB
                )
                // fold same tier/type into each other
                .reduce((array, current, index) => {
                    if(index === 0) {
                        array.push(current);
                        return array;
                    }
                    const last = array[ array.length - 1 ];
                    if(last.tier === current.tier && last.typeId === current.typeId) {
                        last.amount += current.amount;
                    }
                    else {
                        array.push(current);
                    }
                    return array;
                }, []);
        });

        return (!catalysts.gold)? (
            <div m="ChampionUpgrades" />
        ): (
            <div
                m="ChampionUpgrades"
                title={ lang.get('upgrade-cost') }
                class="champion-upgrade">
                { [ CATALYST.BASIC, CATALYST.CLASS, CATALYST.ALPHA ]
                    .filter((type) => Boolean(catalysts[ type ]))
                    .map((type) => {
                        return catalysts[ type ].map(({ type, tier, amount, typeId }) => (
                            <span
                                class={ classnames('champion-upgrade-catalyst', `champion-upgrade-catalyst--${ type }`, {
                                    [ `champion-upgrade-catalyst--class-${ typeId }` ]: type === CATALYST.CLASS,
                                }) }
                            >
                                { amount } x
                                <ImageIcon
                                    src={ (type === CATALYST.CLASS)
                                        ? `images/catalysts/tier_${ tier }_${ typeId }.png`
                                        : `images/catalysts/tier_${ tier }_${ type }.png`
                                    }
                                    icon="share-alt"
                                    after
                                />
                            </span>
                        ));
                    })
                }
                <span class={ classnames('champion-upgrade-catalyst', 'champion-upgrade-catalyst--gold') }>
                    { catalysts[ CATALYST.GOLD ] } x
                    <ImageIcon src={ 'images/catalysts/gold.png' } icon="circle" after />
                </span>
            </div>
        );
    },
};

export default ChampionUpgrades;