export enum ComparisonResult {
  Lower = -1,
  Equal = 0,
  Greater = 1,
}

/**
 * Represents a Semantic Version as described in [https://semver.org](semver.org)
 */
export class SemVersion {
  public readonly strVersion: string;

  public readonly isValid: boolean;

  public readonly major: number;

  public readonly minor: number;

  public readonly patch: number;

  public readonly preReleaseIdentifiers: string[];

  public readonly buildMetadataIdentifiers: string[];

  private static readonly REGEX = /^(?<major>0|[1-9]\d*)\.(?<minor>0|[1-9]\d*)\.(?<patch>0|[1-9]\d*)(?:-(?<preReleaseIdentifiers>(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<buildMetadataIdentifiers>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

  constructor(strVersion: string) {
    this.strVersion = strVersion;
    const exec: RegExpExecArray = SemVersion.REGEX.exec(strVersion);
    this.isValid = Boolean(exec);
    if (!exec) {
      return;
    }
    const { groups } = exec;
    this.major = parseInt(groups.major, 10);
    this.minor = parseInt(groups.minor, 10);
    this.patch = parseInt(groups.patch, 10);
    this.preReleaseIdentifiers = groups.preReleaseIdentifiers ? groups.preReleaseIdentifiers.split('.') : [];
    this.buildMetadataIdentifiers = groups.buildMetadataIdentifiers ? groups.buildMetadataIdentifiers.split('.') : [];
  }

  /**
     * Compare the two provided versions.
     *    -1 if version1 <  version2
     *     0 if version1 == version2
     *     1 if version1 >  version2
     * @param version1 first version to compare - as instance of SemVersion or string
     * @param version2 second version to compare - as instance of SemVersion or string
     */
  static compare(version1: SemVersion | string, version2: SemVersion | string): ComparisonResult {
    const v1: SemVersion = typeof version1 === 'string' ? new SemVersion(version1) : version1;
    const v2: SemVersion = typeof version2 === 'string' ? new SemVersion(version2) : version2;
    if (!v1.isValid || !v2.isValid) {
      throw new Error('You can only compare valid versions');
    }
    if (v1.major !== v2.major) {
      return v1.major < v2.major ? ComparisonResult.Lower : ComparisonResult.Greater;
    }
    if (v1.minor !== v2.minor) {
      return v1.minor < v2.minor ? ComparisonResult.Lower : ComparisonResult.Greater;
    }
    if (v1.patch !== v2.patch) {
      return v1.patch < v2.patch ? ComparisonResult.Lower : ComparisonResult.Greater;
    }
    if (!v1.preReleaseIdentifiers.length !== !v2.preReleaseIdentifiers.length) {
      return v1.preReleaseIdentifiers.length ? ComparisonResult.Lower : ComparisonResult.Greater;
    }
    for (
      let pos = 0;
      pos < Math.min(v1.preReleaseIdentifiers.length, v2.preReleaseIdentifiers.length);
      pos += 1
    ) {
      const val1 = v1.preReleaseIdentifiers[pos];
      const val2 = v2.preReleaseIdentifiers[pos];

      const isV1Num: boolean = /^\d+$/.test(val1);
      const isV2Num: boolean = /^\d+$/.test(val2);

      if (isV1Num && isV2Num) {
        const numVal1: number = parseInt(val1, 10);
        const numVal2: number = parseInt(val2, 10);
        if (numVal1 !== numVal2) {
          return numVal1 < numVal2 ? ComparisonResult.Lower : ComparisonResult.Greater;
        }
      } else if (!isV1Num && !isV2Num) {
        if (val1 !== val2) {
          return val1 < val2 ? ComparisonResult.Lower : ComparisonResult.Greater;
        }
      } else {
        return isV1Num ? ComparisonResult.Lower : ComparisonResult.Greater;
      }
    }
    if (v1.preReleaseIdentifiers.length !== v2.preReleaseIdentifiers.length) {
      return v1.preReleaseIdentifiers.length < v2.preReleaseIdentifiers.length
        ? ComparisonResult.Lower : ComparisonResult.Greater;
    }
    return ComparisonResult.Equal;
  }

  /**
     * Greater than? true if the first version is strictly greater (>) than the second
     * @param version1 first version to compare - as instance of SemVersion or string
     * @param version2 second version to compare - as instance of SemVersion or string
     */
  static gt(version1: SemVersion | string, version2: SemVersion | string): boolean {
    return SemVersion.compare(version1, version2) > 0;
  }

  /**
     * Greater or equal? true if the first version is greater than or equal to (>=) the second
     * @param version1 first version to compare - as instance of SemVersion or string
     * @param version2 second version to compare - as instance of SemVersion or string
     */
  static ge(version1: SemVersion | string, version2: SemVersion | string): boolean {
    return SemVersion.compare(version1, version2) >= 0;
  }

  /**
     * Lower than? true if the first version is strictly lower (<) than the second
     * @param version1 first version to compare - as instance of SemVersion or string
     * @param version2 second version to compare - as instance of SemVersion or string
     */
  static lt(version1: SemVersion | string, version2: SemVersion | string): boolean {
    return SemVersion.compare(version1, version2) < 0;
  }

  /**
     * Lower or equal? true if the first version is lower than or equal to (<=) the second
     * @param version1 first version to compare - as instance of SemVersion or string
     * @param version2 second version to compare - as instance of SemVersion or string
     */
  static le(version1: SemVersion | string, version2: SemVersion | string): boolean {
    return SemVersion.compare(version1, version2) <= 0;
  }

  /**
     * equal? true if the first version is equal to (==) the second
     * @param version1 first version to compare - as instance of SemVersion or string
     * @param version2 second version to compare - as instance of SemVersion or string
     */
  static eq(version1: SemVersion | string, version2: SemVersion | string): boolean {
    return SemVersion.compare(version1, version2) === 0;
  }

  /**
     * Compare this version to the provided one
     *    -1 if this <  comparison
     *     0 if this == comparison
     *     1 if this >  comparison
     * @param comparison second version to compare - as instance of SemVersion or string
     */
  compareTo(comparison: SemVersion | string): ComparisonResult {
    return SemVersion.compare(this, comparison);
  }

  /**
     * Greater than? true if this version is strictly greater (>) than the compared one
     * @param comparison second version to compare - as instance of SemVersion or string
     */
  gt(comparison: SemVersion | string): boolean {
    return SemVersion.compare(this, comparison) > 0;
  }

  /**
     * Greater or equal? true if this version is greater than or equal to (>=) the compared one
     * @param comparison second version to compare - as instance of SemVersion or string
     */
  ge(comparison: SemVersion | string): boolean {
    return SemVersion.compare(this, comparison) >= 0;
  }

  /**
     * Lower than? true this version is strictly lower (<) than the compared one
     * @param comparison second version to compare - as instance of SemVersion or string
     */
  lt(comparison: SemVersion | string): boolean {
    return SemVersion.compare(this, comparison) < 0;
  }

  /**
     * Lower or equal? true this version is lower than or equal to (<=) the compared one
     * @param comparison second version to compare - as instance of SemVersion or string
     */
  le(comparison: SemVersion | string): boolean {
    return SemVersion.compare(this, comparison) <= 0;
  }

  /**
     * equal? true if this version is equal to (==) the compared one
     * @param comparison second version to compare - as instance of SemVersion or string
     */
  eq(comparison: SemVersion | string): boolean {
    return SemVersion.compare(this, comparison) === 0;
  }

  toString(): string {
    return this.strVersion;
  }
}
