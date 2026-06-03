import styled from "@emotion/styled";
import { format } from "d3-format";
import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import Store from "../../Interface/Store2";
import { LightGray } from "../../Preset/Colors";
import { CellSVGHeight, CellSVGWidth } from "../../Preset/Constants";

type Props = {
    actualVal: number | string;
    percentage: number;
    tooltip?: string;
};
{/* this percentage chart no longer changes based on click but on the percentage or count drop down in the settings bar */}
const PercentageChart: FC<Props> = ({ actualVal, percentage, tooltip }: Props) => {

const store = useContext(Store);

{/*onClick={() => actualVal === 0 ? null : store.updateShowPercentage()} */} 
    return (
        <SmallerComponentSVG >
            {/* minimum width would be 2 px to show things. */}
            {computeTextOutcome(actualVal, percentage, store.showPercentage) === '0' ? <></> : <rect x={0} y={0}
                fill="none"
                width={CellSVGWidth}
                height={CellSVGHeight}
                strokeWidth={2}
                stroke={LightGray} />}

            <rect x={0}
                y={0}
                opacity={actualVal === 0 ? 0 : 1}
                width={(percentage * CellSVGWidth > 2 ? percentage * CellSVGWidth : 2) || 0}
                height={CellSVGHeight}
                fill={LightGray} />

            <BarText x={CellSVGWidth / 2}
                y={CellSVGHeight / 2}
                textAnchor='middle'>
                {computeTextOutcome(actualVal, percentage, store.showPercentage)}
            </BarText>
        </SmallerComponentSVG>
    );
};
{/* This uses store.showPercentage to decide to show percentage or number
        If it is true it displays the percentage with 1 decimal place or 0 if noDecimal is true
        If it is false it displays the actual number value
    Special cases:
        If input is 0 it always shows 0
        If input is n<10 it shows n<10 because of the data Utah gives 
        If percentage is NaN it shows the formatted number*/}
export const computeTextOutcome = (input: string | number, percentage: number, showPercentage: boolean, noDecimal?: boolean) => {
    if (input === 0) {
        return '0';
    }
    if (input === 'n<10') {
        return input;
    }
    if (Number.isNaN(percentage)) {
        return format(',')(+input);
    }
    if (noDecimal) {
        return showPercentage ? format(',.0%')(percentage) : format(',')(+input);
    }
    return showPercentage ? format(',.1%')(percentage) : format(',')(+input);
};

const BarText = styled.text`
    alignment-baseline: middle;
    fill: black;
`;

const SmallerComponentSVG = styled.svg({
    width: CellSVGWidth,
    height: CellSVGHeight,
    verticalAlign: 'middle'
});

export default observer(PercentageChart);
