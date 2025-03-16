import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import { Votingdapp } from '../target/types/votingdapp'
import { BankrunProvider, startAnchor } from 'anchor-bankrun'
import { publicKey } from '@coral-xyz/anchor/dist/cjs/utils'

const IDL = require("../target/idl/votingdapp.json")
const votingAddress = new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF")

describe('votingdapp', () => {
  it('Initialize Poll', async () =>{
    const context = await startAnchor("", [{name: "votingdapp", programId: votingAddress}], []);
    const provider = new BankrunProvider(context)

    const votingProgram = new Program<Votingdapp>(IDL, provider);

    await votingProgram.methods.initializePoll(
      new anchor.BN(1),
      "Who is the best player in the world?",
      new anchor.BN(0),
      new anchor.BN(1842152449),
    ).rpc();
    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
      votingAddress,
    )

    const poll = await votingProgram.account.poll.fetch(pollAddress)
    console.log(poll)

    // testing polls
    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description).toEqual("Who is the best player in the world?");
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());
  }, 30000)
})
