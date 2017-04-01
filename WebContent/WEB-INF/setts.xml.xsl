<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
    <servers>
        <server>
            <id>meituan-nexus-snapshots</id>
            <username>deployment</username>
            <password>deployment123</password>
        </server>
        <server>
            <id>meituan-nexus-releases</id>
            <username>deployment</username>
            <password>deployment123</password>
        </server>
        <server>
            <id>meituan-nexus</id>
            <username>deployment</username>
            <password>deployment123</password>
        </server>
        <server>
            <id>nexus-snapshots</id>
            <username>deployment</username>
            <password>deployment123</password>
        </server>
    </servers>
    <profiles>
        <profile>
            <id>nexus</id>
            <repositories>
                <repository>
                    <id>nexus</id>
                    <name>local private nexus</name>
                    <url>http://maven.sankuai.com/nexus/content/groups/public</url>
                </repository>
            </repositories>
        </profile>
        <!--<profile>
           <id>sonar</id>
              <activation>
                 <activeByDefault>true</activeByDefault>
                        </activation>
                           <properties>
                              <sonar.jdbc.url>jdbc:mysql://192.168.4.140:3306/sonar?useUnicode=true&;characterEncoding=Cp1252&rewriteBatchedStatements=true&useConfigs=maxPerformance</sonar.jdbc.url>
                                 <sonar.jdbc.driverClassName>com.mysql.jdbc.Driver</sonar.jdbc.driverClassName>
                                    <sonar.jdbc.username>sonar</sonar.jdbc.username>
                                       <sonar.jdbc.password>sonar</sonar.jdbc.password>
                                          <sonar.host.url>http://192.168.4.140:9000</sonar.host.url>
                                             </properties>
                                                    </profile>-->
        <profile>
            <id>nexus-snapshots</id>
            <repositories>
                <repository>
                    <id>nexus-snapshots</id>
                    <name>local private nexus snapshots</name>
                    <!--<url>http://maven.sankuai.com/nexus/content/repositories/snapshots</url>-->
                    <url>http://maven.sankuai.com/nexus/content/groups/public-snapshots</url>
                </repository>
            </repositories>
        </profile>

        <profile>
            <id>maven central</id>
            <repositories>
                <repository>
                    <id>maven central</id>
                    <name>maven central</name>
                    <url>http://maven.sankuai.com/nexus/content/repositories/central</url>
                </repository>
            </repositories>
        </profile>
        <profile>
            <id>dianping</id>
            <activation>
                <activeByDefault>true</activeByDefault>
                <jdk>1.6</jdk>
            </activation>
            <properties>
                <repo.internal.snapshots.url>http://mvn.dianpingoa.com/dianping-snapshots</repo.internal.snapshots.url>
                <repo.internal.releases.url>http://mvn.dianpingoa.com/dianping-releases</repo.internal.releases.url>
                <repo.external.url>http://mvn.dianpingoa.com/third-party</repo.external.url>
                <repo.proxy.url>http://mvn.dianpingoa.com/dprepo</repo.proxy.url>
            </properties>
            <repositories>
                <repository>
                    <id>dianping-internal-snapshots</id>
                    <name>Dian Ping internal repository for snapshots artifacts</name>
                    <url>http://mvn.dianpingoa.com/dianping-snapshots</url>
                    <snapshots>
                        <enabled>true</enabled>
                    </snapshots>
                    <releases>
                        <enabled>false</enabled>
                    </releases>
                </repository>
                <repository>
                    <id>dianping-internal-releases</id>
                    <name>Dian Ping internal repository for released artifacts</name>
                    <url>http://mvn.dianpingoa.com/dianping-releases</url>
                    <snapshots>
                        <enabled>false</enabled>
                    </snapshots>
                    <releases>
                        <enabled>true</enabled>
                    </releases>
                </repository>
                <!-- no snapshot allowed for external repositories! -->
                <repository>
                    <id>dianping-third-party</id>
                    <name>Dian Ping cache server for external repositories</name>
                    <url>http://mvn.dianpingoa.com/third-party</url>
                    <snapshots>
                        <enabled>false</enabled>
                    </snapshots>
                    <releases>
                        <enabled>true</enabled>
                    </releases>
                </repository>
                <repository>
                    <id>central</id>
                    <name>Dian Ping proxy server for external repositories</name>
                    <url>http://mvn.dianpingoa.com/dprepo</url>
                    <snapshots>
                        <enabled>false</enabled>
                    </snapshots>
                    <releases>
                        <enabled>true</enabled>
                    </releases>
                </repository>
                <repository>
                    <id>maven-restlet</id>
                    <name>Public online Restlet repository</name>
                    <url>http://maven.restlet.org</url>
                </repository>
            </repositories>
            <pluginRepositories>
                <pluginRepository>
                    <id>dianping-internal-snapshots</id>
                    <name>Dian Ping internal repository for snapshots artifacts</name>
                    <url>http://mvn.dianpingoa.com/dianping-snapshots</url>
                    <snapshots>
                        <enabled>true</enabled>
                    </snapshots>
                    <releases>
                        <enabled>false</enabled>
                    </releases>
                </pluginRepository>
                <pluginRepository>
                    <id>dianping-internal-releases</id>
                    <name>Dian Ping internal repository for released artifacts</name>
                    <url>http://mvn.dianpingoa.com/dianping-releases</url>
                    <snapshots>
                        <enabled>false</enabled>
                    </snapshots>
                    <releases>
                        <enabled>true</enabled>
                    </releases>
                </pluginRepository>
                <!-- no snapshot allowed for external repositories -->
                <pluginRepository>
                    <id>dianping-central-cache</id>
                    <name>Dian Ping cache to external repositories</name>
                    <url>http://mvn.dianpingoa.com/third-party</url>
                    <snapshots>
                        <enabled>false</enabled>
                    </snapshots>
                </pluginRepository>
                <pluginRepository>
                    <id>central</id>
                    <name>Platform proxy to external repositories</name>
                    <url>http://mvn.dianpingoa.com/dprepo</url>
                    <snapshots>
                        <enabled>false</enabled>
                    </snapshots>
                </pluginRepository>
            </pluginRepositories>
        </profile>
    </profiles>

    <pluginGroups>
        <pluginGroup>org.apache.maven.plugins</pluginGroup>
        <pluginGroup>org.unidal.maven.plugins</pluginGroup>
        <pluginGroup>com.dianping.maven.plugins</pluginGroup>
    </pluginGroups>

    <activeProfiles>
        <activeProfile>nexus</activeProfile>
        <activeProfile>nexus-snapshots</activeProfile>
        <activeProfile>maven central</activeProfile>
        <activeProfile>dianping</activeProfile>
    </activeProfiles>
</settings>
