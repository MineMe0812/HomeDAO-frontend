import { Box, Link, Paper, SvgIcon, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Icon } from "@olympusdao/component-library";
import React from "react";
import { NavLink } from "react-router-dom";
import { ReactComponent as lendAndBorrowIcon } from "src/assets/icons/lendAndBorrow.svg";
import HomeLogo from "src/assets/logo.png";
import NavItem from "src/components/library/NavItem";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { BondDiscount } from "src/views/Bond/components/BondDiscount";
import { DetermineRangeDiscount } from "src/views/Range/hooks";
import { useNetwork } from "wagmi";

const PREFIX = "NavContent";

const classes = {
  gray: `${PREFIX}-gray`,
};

const StyledBox = styled(Box)(({ theme }) => ({
  [`& .${classes.gray}`]: {
    color: theme.colors.gray[90],
  },
}));

const NavContent: React.VFC = () => {
  const theme = useTheme();
  const { chain = { id: 1 } } = useNetwork();
  const networks = useTestableNetworks();

  return (
    <Paper className="dapp-sidebar">
      <Box className="dapp-sidebar-inner" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
          <Box className="branding-header">
            <Link href="" target="_blank" rel="noopener noreferrer">
              <img src={HomeLogo} alt="HomeDAO" style={{ minWidth: "230px", minHeight: "51px", width: "230px" }} />
            </Link>
          </Box>

          <div className="dapp-menu-links">
            <div className="dapp-nav" id="navbarNav">
              <NavItem to="/dashboard" icon="dashboard" label={`Dashboard`} />
              {chain.id === networks.MAINNET ? (
                <>
                  {/* <Box className="menu-divider">
                    <Divider sx={{ borderColor: theme.colors.gray[600] }} />
                  </Box> */}
                  <NavItem to="/stake" icon="stake" label={`Stake`} />
                  {/* <NavItem
                    customIcon={<SvgIcon component={lendAndBorrowIcon} />}
                    label={`Lend & Borrow`}
                    to="/lending"
                  /> */}
                  <NavItem icon="settings" label={`Provide Liquidity`} to="/liquidity" />
                  <NavItem to="/range" icon="range" label={`Range`} defaultExpanded={false}>
                    <RangePrice bidOrAsk="ask" />
                    <RangePrice bidOrAsk="bid" />
                  </NavItem>
                  <NavItem href="https://vote.olympusdao.finance/" icon="voting" label={`Governance`} />
                </>
              ) : (
                <>
                  <NavItem
                    customIcon={<SvgIcon component={lendAndBorrowIcon} />}
                    label={`Lend & Borrow`}
                    to="/lending"
                  />
                  <NavItem icon="settings" label={`Provide Liquidity`} to="/liquidity" />
                </>
              )}

              {/* <Box className="menu-divider">
                <Divider sx={{ borderColor: theme.colors.gray[600] }} />
              </Box> */}
              <NavItem icon="bridge" label={`Bridge`} to="/bridge" />
              <NavItem icon="transparency" label={`Transparency`} href="https://www.olympusdao.finance/transparency" />
              {/* <Box className="menu-divider">
                <Divider sx={{ borderColor: theme.colors.gray[600] }} />
              </Box> */}
            </div>
          </div>
        </div>
        <Box>
          <NavItem href="https://forum.olympusdao.finance/" icon="forum" label={`Forum`} />
          <NavItem href="https://docs.olympusdao.finance/" icon="docs" label={`Docs`} />
          <StyledBox display="flex" justifyContent="space-around" paddingY="24px">
            <Link href="#" target="_blank" rel="noopener noreferrer">
              <Icon name="github" />
            </Link>

            <Link href="" target="_blank" rel="noopener noreferrer">
              <Icon name="medium" />
            </Link>

            <Link href="" target="_blank" rel="noopener noreferrer">
              <Icon name="twitter" />
            </Link>

            <Link href="" target="_blank" rel="noopener noreferrer">
              <Icon name="discord" />
            </Link>
          </StyledBox>
        </Box>
      </Box>
    </Paper>
  );
};

const RangePrice = (props: { bidOrAsk: "bid" | "ask" }) => {
  const { data, isFetched } = DetermineRangeDiscount(props.bidOrAsk);
  return (
    <>
      {isFetched && (
        <Box ml="26px" mt="12px" mb="12px" mr="18px">
          <Typography variant="body2" color="textSecondary">
            {props.bidOrAsk === "bid" ? `Bid` : `Ask`}
          </Typography>
          <Box mt="12px">
            <Box mt="8px">
              <Link component={NavLink} to={`/range`}>
                <Box display="flex" flexDirection="row" justifyContent="space-between">
                  <Typography variant="body1">{data.quoteToken}</Typography>
                  <BondDiscount discount={new DecimalBigNumber(data.discount.toString())} />
                </Box>
              </Link>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default NavContent;
