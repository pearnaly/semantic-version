import { expect } from 'chai';
import { SemVersion } from './semVersion';

const orderedStrVersions = ['1.0.0-alpha', '1.0.0-alpha.1', '1.0.0-alpha.beta', '1.0.0-beta', '1.0.0-beta.2', '1.0.0-beta.11', '1.0.0-rc.1', '1.0.0'];

describe('SemVersion', () => {
  it('parse simple version', () => {
    const version = new SemVersion('1.2.3');
    expect(version.isValid).equal(true);
    expect(version.major).equal(1);
    expect(version.minor).equal(2);
    expect(version.patch).equal(3);
  });

  it('reject simple error', () => {
    const version = new SemVersion('1.a.3');
    expect(version.isValid).equal(false);
  });

  it('parse long version', () => {
    const version = new SemVersion('1.0.0-beta+exp.sha.5114f85');
    expect(version.isValid).equal(true);
    expect(version.major).equal(1);
    expect(version.minor).equal(0);
    expect(version.patch).equal(0);
    expect(version.preReleaseIdentifiers).to.have.ordered.members(['beta']);
    expect(version.buildMetadataIdentifiers).to.have.ordered.members(['exp', 'sha', '5114f85']);
  });

  it('parse basically several examples', () => {
    const orderedVersions = orderedStrVersions.map((strVersion) => new SemVersion(strVersion));
    expect(orderedVersions).to.satisfy((vers: SemVersion[]) => vers.every((ver) => ver.isValid));
  });

  it('comparison (order)', () => {
    const orderedVersions = orderedStrVersions.map((strVersion) => new SemVersion(strVersion));
    const reorderedVersions = orderedVersions.reverse()
      .sort((v1, v2) => SemVersion.compare(v1, v2));
    expect(reorderedVersions.map((v) => v.toString())).to.have.ordered.members(orderedStrVersions);
  });

  it('comparison (same)', () => {
    const orderedVersions = orderedStrVersions.map((strVersion) => new SemVersion(strVersion));
    expect(orderedVersions).to.satisfy((vers: SemVersion[]) => vers.every((ver) => ver.eq(ver)));
  });
});
