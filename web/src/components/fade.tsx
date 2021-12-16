import styled, { keyframes } from "styled-components";

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Fade = styled.div<{ timing?: string }>`
  animation: ${fadeIn} ${(props) => props.timing || "420ms"}
    cubic-bezier(0.19, 1, 0.22, 1);
`;

export default Fade;
