import React from 'react';
import styled from 'styled-components';

// re-usable component to display information passed props in card like shaped div

//Each component of the Card is created using styled components module

const CardContainer = styled.article`
    padding: 0 10px;
    margin: 10px;
    background: #ffffff;
    display: block;
    border-radius: 5px;
    height: auto;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    width: 22%;
    height: 100%;
`
const Date = styled.div`
  color: #000;
  font-weight: 300;
  margin: 6px 0;
  @media (max-width: 500px) {
    font-size: 0.8rem;
}`
const Title = styled.h2`
    color: #fff,
    font-weight: 300;
    @media (max-width: 500px) {
        font-size: 1rem;
    }
`
const Image = styled.img`
    width: 100%;
    height: 30vh;
`

const Card = ({ title, subTitle, image }) => (
    <CardContainer>
        <Title>{title}</Title>
        <Date>Photos: {subTitle}</Date>
        <div style={{ paddingBottom: '2px' }}>Sample Photo: </div>
        <Image src={image}></Image>
    </CardContainer>
);

export default Card;